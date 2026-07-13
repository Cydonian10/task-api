import "reflect-metadata";
import { hashSync } from "bcrypt";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "../src/database/data-source";
import { UserEntity } from "../src/database/entities/user.entity";
import { ProjectEntity } from "../src/database/entities/project.entity";
import { CollaboratorEntity } from "../src/database/entities/collaborator.entity";
import { TaskEntity, TaskStatus } from "../src/database/entities/task.entity";

const PASSWORD = "password123";
const TOTAL_USERS = 15;
const ADMIN_COUNT = 3;
const USER_COUNT = 12;
const PROJECT_COUNT = 5;
const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
];

async function seed() {
  console.log("Connecting to database...");
  await AppDataSource.initialize();
  console.log("Connected.");

  const userRepo = AppDataSource.getRepository(UserEntity);
  const projectRepo = AppDataSource.getRepository(ProjectEntity);
  const collaboratorRepo = AppDataSource.getRepository(CollaboratorEntity);
  const taskRepo = AppDataSource.getRepository(TaskEntity);

  console.log("Cleaning existing data...");
  await taskRepo.query(
    `TRUNCATE TABLE "Task", "Collaborator", "Project", "User" RESTART IDENTITY CASCADE`,
  );
  console.log("Clean.");

  console.log("Creating users...");
  const passwordHash = hashSync(PASSWORD, 10);
  const users: UserEntity[] = [];

  for (let i = 0; i < TOTAL_USERS; i++) {
    const user = new UserEntity();
    user.name = faker.person.fullName();
    user.email = faker.internet.email().toLowerCase();
    user.passwordHash = passwordHash;
    user.roles = i < ADMIN_COUNT ? ["admin"] : ["user"];
    user.dateOfBirth = faker.date.birthdate({ min: 18, max: 65, mode: "age" });
    users.push(user);
  }

  await userRepo.save(users);
  console.log(
    `  Created ${users.length} users (${ADMIN_COUNT} admins, ${USER_COUNT} users).`,
  );

  console.log("Creating projects...");
  const projects: ProjectEntity[] = [];

  for (let i = 0; i < PROJECT_COUNT; i++) {
    const owner = faker.helpers.arrayElement(users);
    const project = new ProjectEntity();
    project.name = faker.company.name();
    project.description = faker.lorem.sentences({ min: 2, max: 4 });
    project.startDate = faker.date.past({ years: 1 });
    project.endDate = faker.date.future({ years: 1 });
    project.ownerId = owner.id;
    projects.push(project);
  }

  await projectRepo.save(projects);
  console.log(`  Created ${projects.length} projects.`);

  console.log("Adding collaborators...");
  const collaborators: CollaboratorEntity[] = [];

  for (const user of users) {
    const projectSubset = faker.helpers.arrayElements(
      projects,
      faker.number.int({ min: 2, max: 4 }),
    );
    for (const project of projectSubset) {
      const collab = new CollaboratorEntity();
      collab.userId = user.id;
      collab.projectId = project.id;
      collaborators.push(collab);
    }
  }

  await collaboratorRepo.save(collaborators);
  console.log(`  Created ${collaborators.length} collaborator assignments.`);

  console.log("Creating tasks...");
  const tasks: TaskEntity[] = [];

  for (const collab of collaborators) {
    const taskCount = faker.number.int({ min: 2, max: 6 });
    for (let j = 0; j < taskCount; j++) {
      const task = new TaskEntity();
      task.title = faker.lorem.sentence({ min: 3, max: 8 });
      task.order = j + 1;
      task.description =
        faker.helpers.maybe(() => faker.lorem.paragraph(), {
          probability: 0.6,
        }) ?? null;
      task.status = faker.helpers.arrayElement(TASK_STATUSES);
      task.dueDate = faker.helpers.arrayElement([
        faker.date.soon({ days: 180 }),
        faker.date.recent({ days: 30 }),
        null,
      ]);
      task.collaboratorId = collab.id;
      tasks.push(task);
    }
  }

  await taskRepo.save(tasks);
  console.log(`  Created ${tasks.length} tasks.`);

  const summary = {
    users: users.length,
    admins: ADMIN_COUNT,
    regularUsers: USER_COUNT,
    projects: projects.length,
    collaborators: collaborators.length,
    tasks: tasks.length,
  };

  console.log("\nSeed completed successfully!");
  console.table(summary);

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
