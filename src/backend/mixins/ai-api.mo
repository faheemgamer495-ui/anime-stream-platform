import AiLib "../lib/ai";

/// AI chat mixin — exposes the aiChat endpoint; no additional state is needed.
mixin () {
  /// Send a user message along with page and error context to the AI assistant.
  /// Returns a short, friendly troubleshooting reply (or a fallback if the API fails).
  public shared func aiChat(
    userMessage : Text,
    pageContext : Text,
    errorContext : Text,
  ) : async Text {
    await AiLib.chat(userMessage, pageContext, errorContext);
  };
};
