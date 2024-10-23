import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Tool } from './interfaces/tool.interface';
import DynamicForm from './components/DynamicForm';
import FormSample from './components/FormSample';

function App() {
  // const [history, setHistory] = useState<{ type: 'system' | 'assistant' | 'user'; prompt: string; timestamp: number }[]>([]);
  // const [chatId, setChatId] = useState<string | null>();
  // const [feedback, setFeedback] = useState<{ [key: number]: 'up' | 'down' }>({});
  const [tool, setTool] = useState<Tool>();

  const baseApiUrl = 'https://c3edu.online/backend/v1';
  const apiEndpointGetToolId = `${baseApiUrl}/micropal/tools/tool/lesson-planner-002`;
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRldiIsInN1YiI6IkNOPWRldixPVT1DM0RldmVsb3BlcixPVT1QZW9wbGUsREM9YzNlZHUsREM9b25saW5lIiwicm9sZXMiOlsiQzNfREVWRUxPUEVSIiwiQzNfQURNSU5JU1RSQVRPUiJdLCJwZXJtaXNzaW9ucyI6WyJSUF9BQ1RJVkVfRElSRUNUT1JZIiwiUlBfQU5BTFlUSUNTIiwiUlBfQVBQUyIsIlJQX0FVRElUIiwiUlBfQkFORFdJRFRIX0xJTUlUUyIsIlJQX0JBVFRFUlkiLCJSUF9CTEFDS19MSVNUSU5HIiwiUlBfQ0FDSElORyIsIlJQX0NMQVNTRVMiLCJSUF9DT05URU5UIiwiUlBfREFTSEJPQVJEIiwiUlBfRklSRVdBTEwiLCJSUF9HUE8iLCJSUF9JTlRFUk5FVF9BQ0NFU1MiLCJSUF9LSU9TSyIsIlJQX0xBTkRJTkdfUEFHRSIsIlJQX0xFQVJOSU5HX1BBVEhTIiwiUlBfTElDRU5TRSIsIlJQX0xPQ0FMX0FSRUFfTkVUV09SSyIsIlJQX01BSU5URU5BTkNFIiwiUlBfTUlDUk9QQUxfQ0hBVCIsIlJQX01JQ1JPUEFMX0hJU1RPUlkiLCJSUF9NSUNST1BBTF9UT09MUyIsIlJQX01PREVNIiwiUlBfTU9OSVRPUklORyIsIlJQX1BST1hZX1NFVFRJTkdTIiwiUlBfUkVNT1RFX1NFUlZJQ0VTIiwiUlBfU0hBUkVTIiwiUlBfVElNRV9DT05GSUdVUkFUSU9OIiwiUlBfVVBEQVRFUiIsIlJQX1VTRVJTIiwiUlBfV0hJVEVMSVNUSU5HIiwiUlBfV0lSRUxFU1MiLCJSUF9XSVJFTEVTU19BQ0NFU1MiXSwibWV0YURhdGEiOnsicHJvZmlsZSI6IkMzRGV2ZWxvcGVyIn0sImlhdCI6MTcyOTU5NDU2NCwiZXhwIjozMzI4NzE5NDU2NH0.vba6HMKWImHbCRPYYnhFensefqw2VXSL0X_6VMa4W3g';
  const headers = useMemo(() => {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  }, []);

  // const handleSave = () => {
  //   if (editableIndex !== null) {
  //     const updatedHistory = [...history];
  //     updatedHistory[editableIndex].prompt = editableText;
  //     setHistory(updatedHistory);
  //     setEditableIndex(null);
  //   }
  // };

  useEffect(() => {
    fetch(apiEndpointGetToolId, { headers })
      .then((response) => response.json())
      .then((data: Tool) => {
        // console.log(`data: [${JSON.stringify(data, undefined, 2)}]`);
        setTool(data);
      });
  }, [apiEndpointGetToolId, headers]);

  return (
    <div className="App">
      <div className="history-container disabled">
        <FormSample />
        {/* {tool && <DynamicForm tool={tool} />} */}
        {/* {tool && processForm(tool, initialValues)} */}
      </div>
    </div>
  );
}

export default App;