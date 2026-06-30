import type { Project, ProjectWithTaskCount, Task } from "./models";
import { buildProjectWithTaskCount } from "../utils/projectMetrics";

export const exampleProject: Project = {
  _id: "proj_1a2b3c4d5e6f7g8h9i0j",
  organizationId: "org_abc123def456",
  name: "Website Redesign",
  description: "Complete overhaul of the company's public-facing website.",
  createdBy: "user_xyz789",
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
};

export const exampleTask: Task = {
  _id: "task_9z8y7x6w5v4u3t2s1r0q",
  organizationId: "org_abc123def456",
  projectId: "proj_1a2b3c4d5e6f7g8h9i0j",
  title: "Design Homepage Mockup",
  description: "Create a high-fidelity mockup of the new homepage in Figma.",
  status: "in_progress",
  priority: "high",
  assignedTo: "user_pqr456",
  dueDate: "2026-02-01T23:59:59.000Z",
  createdAt: "2026-01-16T09:30:00.000Z",
  updatedAt: "2026-01-18T14:00:00.000Z",
};

export const exampleProjectWithTaskCount: ProjectWithTaskCount =
  buildProjectWithTaskCount(exampleProject, [exampleTask]);
