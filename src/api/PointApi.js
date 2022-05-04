import axiosClient from "./axiosClient";

const pointApi = {
  getAll: () => {
    const url = "/points/all";
    return axiosClient.get(url);
  },
};
export default pointApi;
