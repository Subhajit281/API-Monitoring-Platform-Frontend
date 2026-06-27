import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/project.service";
import { ArrowRight } from "lucide-react";

function CreateProjects() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    if (!projectName.trim()) { alert("Project name is required"); return; }
    if (!description.trim()) { alert("Description is required"); return; }
    try {
      setLoading(true);
      const project = await createProject({ name: projectName.trim(), description: description.trim() });
      navigate(`/projects/${project.id}/monitors/create`);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <main className="w-full max-w-3xl mx-auto pt-20 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6">

          {/* HERO */}
          <section className="mb-10 sm:mb-16">
            <p className="uppercase tracking-[0.35em] text-blue-400 text-xs sm:text-sm mb-2">
              Project Setup
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-tight">
              Create Your Project.
            </h1>
            <p className="text-[var(--muted)] text-base sm:text-lg max-w-2xl mt-3">
              Projects help organize monitors, incidents and status pages for your workspace.
            </p>
          </section>

          {/* FORM */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full bg-[rgba(76,67,67,0.03)] border-t-2 border-blue-500 backdrop-blur-xl rounded-lg p-5 sm:p-8"
            >
              {/* PROJECT NAME */}
              <div>
                <label className="block text-white mb-2 sm:mb-3 text-sm sm:text-base">Project Name</label>
                <input
                  type="text"
                  placeholder="Frontend Monitoring"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-11 sm:h-12 rounded-lg bg-[rgba(255,255,255,0.03)] px-4 sm:px-5 text-white outline-none text-sm sm:text-base"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6 sm:mt-8">
                <label className="block text-white mb-2 sm:mb-3 text-sm sm:text-base">Description</label>
                <textarea
                  rows={4}
                  placeholder="eg: Monitor frontend services and APIs."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg bg-[rgba(255,255,255,0.03)] px-4 sm:px-5 py-3 sm:py-4 text-white resize-none outline-none text-sm sm:text-base"
                />
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end mt-8 sm:mt-10">
                <button
                  type="button"
                  onClick={handleCreateProject}
                  disabled={loading}
                  className="px-5 h-10 sm:h-11 rounded-lg bg-[var(--primary)] text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all"
                >
                  {loading ? "Creating..." : "Create & Next"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>
          </section>
        </main>
      </PageWrapper>
    </Layout>
  );
}

export default CreateProjects;