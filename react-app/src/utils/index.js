import { isAxiosError } from "axios";
import { formatCurrency } from "./formatting";
import { capitalize } from "lodash";
import { AxiosHeaders } from "axios";

export function validateZimbabweanPassport2(passportNumber) {
  // Regular expression for Zimbabwean passport format: 2 uppercase letters + 7 digits
  const regex = /^[A-Z]{2}\d{7}$/;

  return regex.test(passportNumber);
}

export function validateZimbabweanPassport(passportNumber) {
  // const regex = /^[A-Za-z]{2}\d{6}$/;
  // return regex.test(passportNumber);
  return true;
}

export function validateZimbabweanID(idNumber) {
  //23155637M75
  const regex = /^\d{8,9}[A-Za-z]{1}\d{2}$/;
  return regex.test(idNumber);
}

export function friendlyDate(date, format) {
  date = new Date(date);
  switch (format) {
    case "second":
      return Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(date);
    case "third":
      return Intl.DateTimeFormat("en-GB", {
        month: "numeric",
        day: "2-digit",
        year: "2-digit",
      }).format(date);
    default:
      return Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "2-digit",
        year: "2-digit",
      }).format(date);
  }
}

export function friendlyDateAndTime(date, format) {
  date = new Date(date);
  switch (format) {
    case "second":
      return Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    case "third":
      return Intl.DateTimeFormat("en-GB", {
        month: "numeric",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    default:
      return Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
  }
}

export async function wait(seconds) {
  return new Promise((resolve, _) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function fmtAmount(amount) {
  return amount >= 0 ? formatCurrency(amount) : `(${formatCurrency(amount * -1)})`;
}

export function userFriendlyErrorOrResponse(obj) {
  console.log(obj);

  if (obj.headers || obj.response?.headers) {
    const headers = new AxiosHeaders(obj.headers || obj.response?.headers);
    if (headers.getContentType().includes("text/html"))
      return `got invalid response type 'html'. Response text: ${obj.statusText || obj.response?.statusText || ""}`;
  }

  if (isAxiosError(obj)) {
    if (obj.response.status === 500) return obj.response.statusText;

    const content =
      obj.response?.data?.errors ||
      obj.response?.data?.error ||
      obj.response?.data?.err ||
      obj.response?.data?.messages ||
      obj.response?.data?.message ||
      obj.response?.data?.results ||
      obj.response?.data?.result ||
      obj.response?.data?.status ||
      obj.response?.data;

    if (content) {
      if (typeof content === "object") return flattenObjectOrList(content);
      else return capitalize(content);
    }
  } else if (obj?.data) {
    const content =
      obj.data?.errors ||
      obj.data?.error ||
      obj.data?.err ||
      obj.data?.messages ||
      obj.data?.message ||
      obj.data?.results ||
      obj.data?.result ||
      obj.data?.status ||
      obj.data;

    if (content) {
      if (typeof content === "object") return flattenObjectOrList(content);
      else return capitalize(content);
    }
  } else if (typeof obj === "object") return flattenObjectOrList(obj);
  else if (typeof obj === "string") return capitalize(obj);
  else return "something went wrong! Please try again.";
}

export function flattenObjectOrList(objOrList) {
  const isObject = objOrList.__proto__ === {}.__proto__;
  const isList = objOrList.__proto__ === [].__proto__;

  if (!(isObject || isList)) {
    throw new TypeError(
      `argument received is neither an object nor a list: ${objOrList.__proto__}"`
    );
  }

  let text = "";

  if (isObject) {
    Object.keys(objOrList).forEach((key) => {
      const value = objOrList[key];
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        text += `${capitalize(key)} - ${value}. `;
      } else {
        text += `${capitalize(key)} - ${flattenObjectOrList(value)}`;
      }
    });
  } else {
    objOrList.forEach((value) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        text += `${capitalize(value)}. `;
      } else {
        text += flattenObjectOrList(value);
      }
    });
  }

  return text;
}

/**
 * checks if a string is numeric
 *
 * @param {string} string
 * @returns {boolean}
 */
export function isNumeric(string) {
  return /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(string);
}

export function mapToMessages(data) {
  const maintenanceMsgs = data.maintenance.map((item) => ({
    timestamp: item.updated_at,
    user: item.user_name,
    communicationType: "maintenance",
    data: {
      ...item,
    },
  }));

  const worksMsgs = data.works.map((item) => ({
    timestamp: item.updated_at,
    user: item.user_name,
    communicationType: "works",
    data: {
      ...item,
    },
  }));

  return [...worksMsgs, ...maintenanceMsgs];
}

export function areMonthlyBalancesAllDefinedInOrder(balancesFromLatestToOldest = []) {
  const reversed = [...balancesFromLatestToOldest].reverse();
  const lastDefinedIndex = reversed.findIndex(Boolean);

  if (lastDefinedIndex !== -1) {
    // Convert back to the original index
    const index = balancesFromLatestToOldest.length - 1 - lastDefinedIndex;
    return balancesFromLatestToOldest.slice(0, index).every(Boolean);
  }

  return true;
}

export function capitalizeAllWords(str) {
  if (typeof str !== "string") return str;

  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
