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
        <main className="w-[90%] max-w-3xl mx-auto pt-20 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6">

          {/* HERO */}
          <section className="mb-10 sm:mb-16">
            <p className="uppercase tracking-[0.35em] text-blue-400 text-xs font-bold mb-3 sm:mb-6">
              Project Setup
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-tight">
              Create Your Project.
            </h1>
            <p className="text-[var(--muted)] text-sm text-base sm:text-lg max-w-2xl mt-3">
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
                <label className="block text-white mb-2 sm:mb-3 text-xs font-semibold sm:text-base">Project Name</label>
                <input
                  type="text"
                  placeholder="Frontend Monitoring"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-9 sm:h-11 rounded-md bg-[rgba(255,255,255,0.01)] border border-white/10 px-3 sm:px-4 text-gray-300 font-semibold focus:border-blue-500  outline-none text-xs sm:text-sm"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6 sm:mt-8">
                <label className="block text-white mb-2 sm:mb-3 text-xs sm:text-sm font-semibold">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="eg: Monitor frontend services and APIs."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="
                    w-full
                    min-h-[90px] sm:min-h-[110px]
                    rounded-md
                    bg-[rgba(255,255,255,0.01)]
                    border border-white/10
                    px-3 sm:px-4
                    py-2.5 sm:py-3
                    text-xs sm:text-sm
                    text-gray-300
                    resize-none
                    outline-none
                    focus:border-blue-500
                    transition-all
                  "
                />
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end mt-8 sm:mt-10">
                <button
                  type="button"
                  onClick={handleCreateProject}
                  disabled={loading}
                  className="px-2 h-9 sm:h-11 rounded-lg bg-blue-700 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-[14px] sm:text-base transition-all"
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