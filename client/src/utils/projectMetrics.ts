import type { Project, ProjectWithTaskCount, Task } from "../types/models";

export const buildProjectWithTaskCount = (
  project: Project,
  tasks: Task[],
): ProjectWithTaskCount => {
  return {
    ...project,
    taskCount: tasks.filter((task) => task.projectId === project._id).length,
  };
};
