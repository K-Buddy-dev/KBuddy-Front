export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const formatRelativeDate = (createdAt: string, modifiedAt?: string): string => {
  const createdDate = new Date(createdAt);

  let latestDate: Date;

  if (!modifiedAt) {
    latestDate = createdDate;
  } else {
    const modifiedDate = new Date(modifiedAt);
    latestDate = createdDate > modifiedDate ? createdDate : modifiedDate;
  }

  const now = new Date();
  const diffMs = now.getTime() - latestDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  } else {
    return `${diffSeconds}s ago`;
  }
};
