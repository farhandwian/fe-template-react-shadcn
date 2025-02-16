import React from "react";

interface KlimatologiIconProps {
  isSelected?: boolean;
}

const KlimatologiIcon: React.FC<KlimatologiIconProps> = ({ isSelected }) => {
  const iconColor = isSelected ? "#FAD605" : "#FFFFFF";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.41458 1.36981C7.09606 3.74018 3.28125 10.8365 3.28125 13.3624C3.28125 14.8398 3.86813 16.2566 4.91277 17.3013C5.95742 18.3459 7.37427 18.9328 8.85162 18.9328C10.329 18.9328 11.7458 18.3459 12.7905 17.3013C13.8351 16.2566 14.422 14.8398 14.422 13.3624C14.422 10.8365 10.6072 3.73278 9.29236 1.36981C9.24852 1.29198 9.18478 1.2272 9.10765 1.18212C9.03053 1.13704 8.9428 1.11328 8.85347 1.11328C8.76414 1.11328 8.67642 1.13704 8.59929 1.18212C8.52217 1.2272 8.45842 1.29198 8.41458 1.36981ZM10.085 13.7624C11.0109 13.392 11.4738 13.9291 12.1109 14.3735C13.0961 14.9809 13.3257 14.7031 14.0775 14.1513L14.1961 14.0809C14.0446 15.3747 13.4174 16.5658 12.4365 17.4229C11.4556 18.2799 10.191 18.7415 8.88866 18.718C7.71655 18.7366 6.57143 18.3655 5.63299 17.663C4.69454 16.9605 4.01587 15.9663 3.70347 14.8365C4.00904 14.8754 4.31872 14.8087 4.58125 14.6476C5.28125 14.2068 5.18495 13.3328 6.32199 13.4846C7.24792 13.5957 7.4331 14.5957 8.29236 14.8143C9.3331 15.092 9.3331 14.1513 10.085 13.7624ZM9.99977 1.52166H13.5664C13.6155 1.52166 13.6627 1.54118 13.6974 1.5759C13.7321 1.61063 13.7516 1.65774 13.7516 1.70685C13.7516 1.75596 13.7321 1.80307 13.6974 1.8378C13.6627 1.87252 13.6155 1.89204 13.5664 1.89204H9.99977C9.95065 1.89204 9.90355 1.87252 9.86882 1.8378C9.83409 1.80307 9.81458 1.75596 9.81458 1.70685C9.81458 1.65774 9.83409 1.61063 9.86882 1.5759C9.90355 1.54118 9.95065 1.52166 9.99977 1.52166ZM11.4812 4.04018H15.0479C15.097 4.04018 15.1441 4.05969 15.1789 4.09442C15.2136 4.12915 15.2331 4.17625 15.2331 4.22537C15.2331 4.27448 15.2136 4.32159 15.1789 4.35631C15.1441 4.39104 15.097 4.41055 15.0479 4.41055H11.4812C11.4321 4.41055 11.385 4.39104 11.3503 4.35631C11.3156 4.32159 11.2961 4.27448 11.2961 4.22537C11.2961 4.17625 11.3156 4.12915 11.3503 4.09442C11.385 4.05969 11.4321 4.04018 11.4812 4.04018ZM16.5294 6.91796H12.9627C12.9136 6.91796 12.8665 6.89845 12.8318 6.86372C12.7971 6.82899 12.7775 6.78189 12.7775 6.73278C12.7775 6.68366 12.7971 6.63656 12.8318 6.60183C12.8665 6.5671 12.9136 6.54759 12.9627 6.54759H16.5294C16.5785 6.54563 16.6264 6.56325 16.6625 6.59659C16.6986 6.62993 16.72 6.67625 16.722 6.72537C16.724 6.77448 16.7063 6.82237 16.673 6.85848C16.6396 6.8946 16.5933 6.916 16.5442 6.91796H16.5294Z"
        fill={iconColor}
      />
    </svg>
  );
};

export default KlimatologiIcon;
