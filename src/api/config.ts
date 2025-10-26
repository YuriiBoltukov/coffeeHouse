export interface AppConfig {
  apiEnabled: boolean;
  useStaticData: boolean;
  apiBaseUrl: string;
}

export const appConfig: AppConfig = {
  apiEnabled: true,
  useStaticData: false,
  apiBaseUrl: 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com'
};

