export const formatDate = (date: string) => {
  date = date.slice(0, 10);
  const dateArray = date.split("-");

  return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
};
