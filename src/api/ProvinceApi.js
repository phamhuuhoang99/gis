import axiosClient from "./axiosClient";

const provinceApi = {
  getAll: params => {
    const url = "/provinces/all";
    return axiosClient.get(url, { params });
  },
  getPointInProvince: ({ gid }) => {
    const url = "/provinces/" + gid + "/poi-in-pol";
    return axiosClient.get(url, {});
  },
};
export default provinceApi;
