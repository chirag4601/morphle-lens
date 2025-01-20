import axios from "axios";

import { getCsrfToken } from "../utils/utils";

export const API_METHODS = Object.freeze({
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
});

export const fetchData = async ({
  url,
  method = API_METHODS.GET,
  data,
  headersPrams,
  onError,
  ...params
}) => {
  try {
    if (!url) return null;
    const fetchedData = await axios({
      method: method,
      url: url,
      data: data,
      ...params,
      headers: {
        "X-CSRFToken": getCsrfToken(),
        ...headersPrams,
      },
    });

    if (fetchedData.status !== 200 && fetchedData.status !== 201) return null;
    if (fetchedData?.data?.error) throw new Error(fetchedData.data.error);
    return fetchedData?.data;
  } catch (error) {
    onError
      ? onError(error?.response?.data?.error || error?.message || error)
      : alert(error?.response?.data?.error || error?.message || error);
    return null;
  }
};
