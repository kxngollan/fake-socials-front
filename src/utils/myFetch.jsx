const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 *
 * @param {*} url the path to the API + path
 * @param {*} options for request method and other options not here
 * @param {*} content_type for the content type, forms with image should be multipart data
 * @returns
 */
export const myFetch = async (
  url,
  options = {},
  user = {},
  content_type = "application/json"
) => {
  console.log(API_URL + url);
  const response = await fetch(API_URL + "/api/" + url, {
    headers: {
      ...(content_type ? { "Content-Type": content_type } : {}),
      ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
    },
    mode: "cors",
    ...options,
  });
  const data = await response.json();
  console.log("the res is : ", response);
  console.log("the data is :", data);
  if (response.ok) return data;
  if (response.status == 401 && data.error == "TokenExpiredError") {
    throw new Error("Token has expired. Please login again.");
  } else {
    throw new Error(data.error || "Failied to fetch data");
  }
};
