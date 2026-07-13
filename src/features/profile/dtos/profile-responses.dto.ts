import { ProjectDto } from "@/src/features/project/dtos/project.dto";

export class OwnedProjectsResponse {
  constructor(
    public count: number,
    public projects: ProjectDto[],
  ) {}
}

export interface CollaborationEntry {
  projectId: number;
  projectName: string;
  projectDescription: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export class CollaborationsResponse {
  constructor(
    public count: number,
    public collaborations: CollaborationEntry[],
  ) {}
}
