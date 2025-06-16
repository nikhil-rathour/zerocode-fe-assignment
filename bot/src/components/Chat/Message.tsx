export const Message = ({ from, text }: { from: string; text: string }) => (
  <div className={`text-${from === 'user' ? 'right' : 'left'} my-1`}>
    <span className={`inline-block p-2 rounded ${from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>
      {text}
    </span>
  </div>
);