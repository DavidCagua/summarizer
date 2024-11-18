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
	RATE_LIMITER: any;
  }

  export interface OpenAIResponse {
	choices: { message: { content: string } }[];
  }
  export interface ApiErrorResponse {
	error: {
	  message: string;
	};
  }
