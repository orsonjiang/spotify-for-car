import Alert from './Alert';

const SiteWrapper = (props) => {
    const { content } = props;

    return (
        <div className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
            <Alert />
            {content}
        </div>
    );
};

export default SiteWrapper;
