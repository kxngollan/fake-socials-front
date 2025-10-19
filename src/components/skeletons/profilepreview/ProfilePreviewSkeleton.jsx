const ProfilePreviewSkeleton = ({ classes }) => {
  return (
    <div className={`profile-preview-card ${classes}`}>
      <div className="skeleton skeleton-image"></div>
      <div>
        <p className="skeleton skeleton-text-medium skeleton-gap"></p>
        <p className="skeleton skeleton-text-medium"></p>
      </div>
      <span className="skeleton-text-medium"></span>
    </div>
  );
};

export default ProfilePreviewSkeleton;
