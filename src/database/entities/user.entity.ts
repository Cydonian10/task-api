import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { CollaboratorEntity } from "./collaborator.entity";

@Entity("User")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column("text", { array: true, default: [] })
  roles!: string[];

  @Column({ name: "date_of_birth", type: "timestamp" })
  dateOfBirth!: Date;

  @OneToMany(() => ProjectEntity, (project) => project.owner)
  projects!: ProjectEntity[];

  @OneToMany(() => CollaboratorEntity, (collaborator) => collaborator.user)
  collaborators!: CollaboratorEntity[];
}
