const PostCardSkeleton = () => {
  return (
    <div className="postcard">
      <div className="post-header">
        <div className="skeleton skeleton-image"></div>
        <span className="skeleton skeleton-text-medium"></span>
        <span className="">•</span>
        <span className="written-time skeleton skeleton-text-short"></span>
      </div>

      <div className="post-body">
        <div className="">
          <p className="skeleton skeleton-line"></p>
          <p className="skeleton skeleton-line"></p>
        </div>
        <p className="post-tags"></p>
      </div>
      <div className="post-buttons">
        <p>
          <span className="skeleton skeleton-text-ultra-short"></span>
        </p>
        <p>
          <span className="skeleton skeleton-text-ultra-short"></span>
        </p>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
