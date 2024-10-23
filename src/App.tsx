import { useEffect, useRef, useState } from 'react';
import './App.css';
import DynamicForm from './components/DynamicForm';
import { Tool } from './interfaces/tool.interface';
// import FormSample from './components/FormSample';

const baseApiUrl = 'https://c3edu.online/backend/v1';
const apiEndpointGetToolId = `${baseApiUrl}/micropal/tools/tool/lesson-planner-002`;
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRldiIsInN1YiI6IkNOPWRldixPVT1DM0RldmVsb3BlcixPVT1QZW9wbGUsREM9YzNlZHUsREM9b25saW5lIiwicm9sZXMiOlsiQzNfREVWRUxPUEVSIiwiQzNfQURNSU5JU1RSQVRPUiJdLCJwZXJtaXNzaW9ucyI6WyJSUF9BQ1RJVkVfRElSRUNUT1JZIiwiUlBfQU5BTFlUSUNTIiwiUlBfQVBQUyIsIlJQX0FVRElUIiwiUlBfQkFORFdJRFRIX0xJTUlUUyIsIlJQX0JBVFRFUlkiLCJSUF9CTEFDS19MSVNUSU5HIiwiUlBfQ0FDSElORyIsIlJQX0NMQVNTRVMiLCJSUF9DT05URU5UIiwiUlBfREFTSEJPQVJEIiwiUlBfRklSRVdBTEwiLCJSUF9HUE8iLCJSUF9JTlRFUk5FVF9BQ0NFU1MiLCJSUF9LSU9TSyIsIlJQX0xBTkRJTkdfUEFHRSIsIlJQX0xFQVJOSU5HX1BBVEhTIiwiUlBfTElDRU5TRSIsIlJQX0xPQ0FMX0FSRUFfTkVUV09SSyIsIlJQX01BSU5URU5BTkNFIiwiUlBfTUlDUk9QQUxfQ0hBVCIsIlJQX01JQ1JPUEFMX0hJU1RPUlkiLCJSUF9NSUNST1BBTF9UT09MUyIsIlJQX01PREVNIiwiUlBfTU9OSVRPUklORyIsIlJQX1BST1hZX1NFVFRJTkdTIiwiUlBfUkVNT1RFX1NFUlZJQ0VTIiwiUlBfU0hBUkVTIiwiUlBfVElNRV9DT05GSUdVUkFUSU9OIiwiUlBfVVBEQVRFUiIsIlJQX1VTRVJTIiwiUlBfV0hJVEVMSVNUSU5HIiwiUlBfV0lSRUxFU1MiLCJSUF9XSVJFTEVTU19BQ0NFU1MiXSwibWV0YURhdGEiOnsicHJvZmlsZSI6IkMzRGV2ZWxvcGVyIn0sImlhdCI6MTcyOTU5NDU2NCwiZXhwIjozMzI4NzE5NDU2NH0.vba6HMKWImHbCRPYYnhFensefqw2VXSL0X_6VMa4W3g';
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
};

function App() {
  // const [history, setHistory] = useState<{ type: 'system' | 'assistant' | 'user'; prompt: string; timestamp: number }[]>([]);
  // const [chatId, setChatId] = useState<string | null>();
  // const [feedback, setFeedback] = useState<{ [key: number]: 'up' | 'down' }>({});
  const [tool, setTool] = useState<Tool>();
  const count = useRef(0);

  count.current++;

  useEffect(() => {
    let isMounted = true;
    fetch(apiEndpointGetToolId, { headers })
      .then((response) => response.json())
      .then((data: Tool) => {
        if (isMounted) {
          setTool(data);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [apiEndpointGetToolId, headers]);

  return (
    <div className="App">
      <div className="history-container">
        <pre>{`count: ${count.current}`}</pre>
        {/* <FormSample /> */}
        {tool && <DynamicForm tool={tool} />}
        {/* {tool && processForm(tool, initialValues)} */}
      </div>
    </div>
  );
}

export default App;
