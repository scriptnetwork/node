import { tokenService } from "../common/services/token";

export const getTotalData = async () => {
  return tokenService
    .getNetworkDetails()
    .then(({ data }) => {
      // Do some formatting here if needed
      return data;
    })
    .catch((err) => {
      console.log(err);
      this.setState({ loading: false });
    });
};
