// Định nghĩa các màn hình và params cho luồng xác thực
export type AuthStackParamList = {
  Login: undefined; // Màn hình Login không nhận params
  Register: undefined;
};

// Định nghĩa các màn hình và params cho luồng ứng dụng chính
export type AppStackParamList = {
  Home: undefined;
  Profile: { userId: string }; // Màn hình Profile nhận một param là userId
};
