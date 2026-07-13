import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ProjectEntity } from "./project.entity";
import { TaskEntity } from "./task.entity";

@Entity("Collaborator")
@Unique("UQ_collaborator_user_project", ["userId", "projectId"])
export class CollaboratorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id", type: "int" })
  userId!: number;

  @Column({ name: "project_id", type: "int" })
  projectId!: number;

  @ManyToOne(() => UserEntity, (user) => user.collaborators, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.collaborators, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project!: ProjectEntity;

  @OneToMany(() => TaskEntity, (task) => task.collaborator)
  tasks!: TaskEntity[];
}
