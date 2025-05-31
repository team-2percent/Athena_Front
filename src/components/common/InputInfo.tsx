interface InputInfoBase {
    errorMessage: string;
    showLength?: boolean;
}

interface WithLength extends InputInfoBase {
    showLength?: true;
    length: number;
    maxLength: number;
}

interface WithoutLength extends InputInfoBase {
    showLength?: false;
    length?: never;
    maxLength?: never;
}

type InputInfoProps = WithLength | WithoutLength;

export default function InputInfo({ errorMessage, showLength = false, length, maxLength }: InputInfoProps) {
    return (
        <div className="w-full flex text-xs min-h-[1rem]">
            <span className="text-red-500 flex-1 truncate">{errorMessage}</span>
            {showLength && (
                <span className="text-gray-500">
                    {length}/{maxLength}
                </span>
            )}
        </div>
    )
}