import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity.js";
import { CollaboratorEntity } from "./collaborator.entity.js";

@Entity("Project")
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "start_date", type: "timestamp" })
  startDate!: Date;

  @Column({ name: "end_date", type: "timestamp" })
  endDate!: Date;

  @Column({ name: "owner_id", type: "int" })
  ownerId!: number;

  @ManyToOne(() => UserEntity, (user) => user.projects, { onDelete: "CASCADE" })
  @JoinColumn({ name: "owner_id" })
  owner!: UserEntity;

  @OneToMany(() => CollaboratorEntity, (collaborator) => collaborator.project)
  collaborators!: CollaboratorEntity[];
}
