interface IChatBotRequest {
    quote: string;
    file?: File;
    history: string;
}

interface IChatBotResponse {
    new_question: string;
    answer: string;
}
