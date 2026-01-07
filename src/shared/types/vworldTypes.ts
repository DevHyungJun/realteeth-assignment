export interface VWorldGeocoderResponse {
  response: {
    status: string;
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    input: {
      point: {
        x: string;
        y: string;
      };
      address: {
        type: string;
        text: string;
      };
    };
    result?: {
      point?: {
        x: string;
        y: string;
      };
      text?: string;
      structure?: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4L: string;
        level4LC: string;
        level4A: string;
        level4AC: string;
        level5: string;
        detail: string;
      };
    };
  };
}
