export type SopSection = {
  id: string;
  title: string;
  content: string;
  isEditing?: boolean;
};

export type SopDocument = {
  id: string;
  title: string;
  industry: string;
  createdAt: string;
  logoUrl?: string;
  sections: SopSection[];
};

export const MOCK_SOPS: SopDocument[] = [
  {
    id: "1",
    title: "Customer Onboarding Flow",
    industry: "Agency",
    createdAt: new Date().toISOString(),
    sections: [
      { id: "s1", title: "1. Purpose", content: "To ensure all new clients receive a consistent and high-quality onboarding experience within the first 48 hours of signing." },
      { id: "s2", title: "2. Scope", content: "Applies to all Account Managers and Client Success Representatives handling newly signed contracts." },
      { id: "s3", title: "3. Responsibilities", content: "- Account Manager: Leads the kickoff call.\n- Ops Coordinator: Sets up Slack channels and Google Drive folders." },
      { id: "s4", title: "4. Procedure", content: "1. Create client folder in Drive.\n2. Invite client to shared Slack channel.\n3. Send kickoff agenda 24h prior to call.\n4. Host kickoff and record via Zoom." },
    ]
  }
];

export const INDUSTRIES = [
  "Agency / Services",
  "E-commerce / D2C",
  "Healthcare",
  "Manufacturing",
  "Software / SaaS",
  "Logistics",
  "Other"
];

// Helper to simulate AI generation
export const generateSopMock = async (processText: string, industry: string): Promise<SopSection[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "gen1", title: "1. Purpose", content: `To standardise the process of: ${processText.substring(0, 50)}...` },
        { id: "gen2", title: "2. Scope", content: `Applies to operations teams within the ${industry} industry.` },
        { id: "gen3", title: "3. Responsibilities", content: "- Process Owner: Oversees execution\n- Team Member: Executes steps" },
        { id: "gen4", title: "4. Procedure", content: "1. Initial Review\n2. Execution Phase\n3. Quality Assurance\n4. Final Sign-off" },
        { id: "gen5", title: "5. QA Checks", content: "- Verify all steps completed\n- Ensure compliance with industry standards" }
      ]);
    }, 2500);
  });
};

export const regenerateSectionMock = async (sectionTitle: string, instruction: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[Regenerated based on: "${instruction}"]\n\nThis is the newly generated content for ${sectionTitle} which incorporates your specific feedback while maintaining the standard operating procedure format.`);
    }, 1500);
  });
};
