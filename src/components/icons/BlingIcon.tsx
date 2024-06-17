
interface IIconProps {
    width?: string;
    height?: string;
    className?: string;
}

const BlingIcon = (props: IIconProps) => {
    return (
        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
            <path d="M14.5 15.5C15.0304 15.5 15.5391 15.7107 15.9142 16.0858C16.2893 16.4609 16.5 16.9696 16.5 17.5C16.5 16.9696 16.7107 16.4609 17.0858 16.0858C17.4609 15.7107 17.9696 15.5 18.5 15.5C17.9696 15.5 17.4609 15.2893 17.0858 14.9142C16.7107 14.5391 16.5 14.0304 16.5 13.5C16.5 14.0304 16.2893 14.5391 15.9142 14.9142C15.5391 15.2893 15.0304 15.5 14.5 15.5ZM14.5 3.5C15.0304 3.5 15.5391 3.71071 15.9142 4.08579C16.2893 4.46086 16.5 4.96957 16.5 5.5C16.5 4.96957 16.7107 4.46086 17.0858 4.08579C17.4609 3.71071 17.9696 3.5 18.5 3.5C17.9696 3.5 17.4609 3.28929 17.0858 2.91421C16.7107 2.53914 16.5 2.03043 16.5 1.5C16.5 2.03043 16.2893 2.53914 15.9142 2.91421C15.5391 3.28929 15.0304 3.5 14.5 3.5ZM7.5 15.5C7.5 13.9087 8.13214 12.3826 9.25736 11.2574C10.3826 10.1321 11.9087 9.5 13.5 9.5C11.9087 9.5 10.3826 8.86786 9.25736 7.74264C8.13214 6.61742 7.5 5.0913 7.5 3.5C7.5 5.0913 6.86786 6.61742 5.74264 7.74264C4.61742 8.86786 3.0913 9.5 1.5 9.5C3.0913 9.5 4.61742 10.1321 5.74264 11.2574C6.86786 12.3826 7.5 13.9087 7.5 15.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export default BlingIcon;
