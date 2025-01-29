export const trimInputFields = (userProfileData: any): any => {
  const trimString = (value: string) => value.trim();

  const trimObject = (obj: any): any => {
    if (typeof obj === "string") {
      return trimString(obj);
    } else if (obj !== null && typeof obj === "object") {
      const trimmedObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          trimmedObj[key] = trimObject(obj[key]);
        }
      }
      return trimmedObj;
    }
    return obj; // Return non-string, non-object fields as-is
  };

  return trimObject(userProfileData);
};
