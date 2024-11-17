export interface RequestData {
	url: string;
	summary_options?: SummaryOptions;
  }

  export interface SummaryOptions {
	word_count?: number;
	style?: string;
  }

  export interface Env {
	OPENAI_API_KEY: string;
  }

  export interface OpenAIResponse {
	choices: { message: { content: string } }[];
  }
  interface ApiErrorResponse {
	error: {
	  message: string;
	};
  }
