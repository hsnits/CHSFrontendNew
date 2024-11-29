import toast from "react-hot-toast";

export const toastMessage = (type, message, config = { duration: 2500 }) => {
  switch (type) {
    case "error":
      return toast.error(message, { ...config, id: message });
    case "success":
      return toast.success(message, { ...config, id: message });
    // case "promise":
    //   if (typeof message !== "function") {
    //     console.error(
    //       "For promise toasts, message should be a function returning a promise"
    //     );
    //     return;
    //   }
    //   return toast.promise(
    //     message(),
    //     {
    //       loading: "Loading...",
    //       success: (data) => `Successfully completed!`,
    //       error: (err) => `This just happened`,
    //     },
    //     config
    //   );
    default:
      return toast(message, { ...config, id: message });
  }
};
