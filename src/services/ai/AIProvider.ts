abstract class AIProvider {
  abstract generateWebsiteSpec(
    questionnaire: Record<string, unknown>,
    assets: Record<string, unknown>[]
  ): Promise<Record<string, unknown>>;

  abstract processRevision(
    websiteSpec: Record<string, unknown>,
    revisionRequest: string
  ): Promise<Record<string, unknown>>;

  abstract generateContent(prompt: string): Promise<string>;
}

export default AIProvider;
