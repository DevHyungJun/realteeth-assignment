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

export interface VWorldReverseGeocoderItem {
  type: "ROAD" | "PARCEL" | "road" | "parcel";
  text: string;
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
}

export interface VWorldReverseGeocoderResponse {
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
      crs: string;
      type: string;
    };
    // result는 배열이거나 객체일 수 있음
    result?: Array<VWorldReverseGeocoderItem> | {
      // items는 배열의 배열일 수도 있고, 단순 배열일 수도 있음
      items?: Array<Array<VWorldReverseGeocoderItem>> | Array<VWorldReverseGeocoderItem>;
      // 또는 다른 필드로 주소 정보가 올 수 있음
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
