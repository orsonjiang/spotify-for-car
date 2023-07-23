const Faq = (props) => {
    const {question, answer, content} = props;
    return (
        <div className='my-6'>
        <h3 className="m-2 text-xl font-medium">{question}</h3>
        <p className="text-md mx-auto max-w-xl">{answer}</p>
        <div className="m-4">{content}</div>
    </div>);
};

export default Faq;