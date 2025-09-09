export const statusRenderings = [
  {
    status: 'PENDING',
    label: 'Đang chờ xác nhận',
    color: '#FFA500', // Màu cam
    id: 1,
  },

  {
    status: 'DELIVERING',
    label: 'Đang giao hàng',
    color: '#1E90FF', // Màu xanh dương
    id: 2,
  },
  {
    status: 'COMPLETED',
    label: 'Đã giao hàng',
    color: '#32CD32', // Màu xanh lá
    id: 3,
  },
  {
    status: 'CANCELLED',
    label: 'Đã hủy',
    color: '#FF4500', // Màu đỏ cam
    id: 4,
  },
];

export const getStatusRendering = (status: string) => {
  return statusRenderings.find((item) => item.status === status);
};
