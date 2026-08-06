import AIProvider from "./AIProvider";
import MockAIProvider from "./MockAIProvider";

const createAIProvider = (): AIProvider => {
  const provider = process.env.AI_PROVIDER || "mock";

  switch (provider) {
    case "mock":
      return new MockAIProvider();
    default:
      console.warn(`Unknown AI provider "${provider}", falling back to mock`);
      return new MockAIProvider();
  }
};

export default createAIProvider;
