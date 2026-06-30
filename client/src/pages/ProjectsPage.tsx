import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { StatusPanel } from "../components/StatusPanel";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import type { Project, ProjectWithTaskCount, Task } from "../types/models";
import { useAuth } from "../hooks/useAuth";
import { canDeleteResources } from "../utils/permissions";
import { buildProjectWithTaskCount } from "../utils/projectMetrics";

export const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formState, setFormState] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const [nextProjects, nextTasks] = await Promise.all([
        projectService.list(),
        taskService.list(),
      ]);
      setProjects(nextProjects);
      setTasks(nextTasks);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load projects",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setActionError(null);

    try {
      const project = await projectService.create(formState);
      setProjects((current) => [project, ...current]);
      setFormState({ name: "", description: "" });
    } catch (submitError) {
      setActionError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create project",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    setActionError(null);
    try {
      await projectService.delete(projectId);
      setProjects((current) =>
        current.filter((project) => project._id !== projectId),
      );
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete project",
      );
    }
  };

  const projectsWithTaskCounts: ProjectWithTaskCount[] = projects.map(
    (project) => buildProjectWithTaskCount(project, tasks),
  );

  if (loading) {
    return (
      <StatusPanel title="Loading projects" message="Fetching project list." />
    );
  }

  if (loadError) {
    return <StatusPanel title="Projects unavailable" message={loadError} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Create internal projects and keep org-scoped delivery work organized."
        title="Projects"
      />
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          className="rounded-3xl bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold text-ink">Create project</h2>
          <div className="mt-4 space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Project name"
              value={formState.name}
            />
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3"
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Description"
              value={formState.description}
            />
            {actionError ? (
              <p className="text-sm text-danger">{actionError}</p>
            ) : null}
            <button
              className="rounded-2xl bg-ink px-4 py-3 font-medium text-white"
              disabled={saving}
              type="submit"
            >
              {saving ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
        <div className="space-y-4">
          {projects.length ? (
            projectsWithTaskCounts.map((project) => (
              <article
                className="rounded-3xl bg-white p-6 shadow-sm"
                key={project._id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">
                      {project.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {project.description}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-500">
                      {project.taskCount}{" "}
                      {project.taskCount === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      className="rounded-full bg-panel px-4 py-2 text-sm font-medium text-ink"
                      to={`/projects/${project._id}`}
                    >
                      View details
                    </Link>
                    {canDeleteResources(user) ? (
                      <button
                        className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-danger"
                        onClick={() => void handleDelete(project._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <StatusPanel
              title="No projects yet"
              message="Create the first project to start organizing work."
            />
          )}
        </div>
      </section>
    </div>
  );
};
