const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };

  return date.toLocaleDateString("en-US", options);
};

const calculateProgress = (completed = 0, total = 0) => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export { formatDate, calculateProgress };
