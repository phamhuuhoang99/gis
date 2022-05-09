import axiosClient from "./axiosClient";

const districtApi = {
  getPontInDistrict: ({ objectid }) => {
    const url = "/districts/" + objectid + "/poi-in-pol";
    return axiosClient.get(url, {});
  },
};
export default districtApi;
