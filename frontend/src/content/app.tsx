import React, { useState } from 'react';

// import './i18n';
import { Main } from "./components/main";
import { useSession } from './hooks/use_session';
import { _HOST, setExportedHost } from './urls';
import { Button, ButtonType, Input } from 'components-ui';

const App: React.FC = () => {

	const [tempHost, setTempHost] = useState<string>(_HOST);
	const [lastUpdate, setLastUpdate] = useState<string | null>(null);

	const { sessionId, resetSession, loading, err, ending, endingErr } = useSession(lastUpdate);

	function changeHost(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		evt.preventDefault();
		setExportedHost(tempHost);
		setLastUpdate(Date());
	}

	if (ending) {
		return <div className="">
			Ending session...
			<div className="">{endingErr}</div>
		</div>
	}

	if (!sessionId) {
		return <div className="select-none font-sourcesanspro h-full w-full flex items-center justify-center bg-gradient-to-bl from-blue-100 to-blue-200">
			<form className="px-8 py-6 w-96 mb-16 lg:w-1/3 rounded-md bg-gradient-to-bl from-blue-200 to-blue-300">
				<div className="font-bold text-center text-xl text-gray-800">HHFA Analysis Platform</div>
				<div className="mt-2 font-semibold text-center text-blue-700">Version 0.1 ~ 31.12.2020</div>
				<div className="mt-4">Backend URL:</div>
				<div className="mt-1">
					<Input
						value={tempHost}
						onChange={setTempHost}
					/>
				</div>
				{loading
					? <div className="mt-4 rounded-md bg-green-300 text-green-800 px-4 py-2">Connecting...</div>
					: err
						? <div className="mt-4 rounded-md bg-red-300 text-red-800 px-4 py-2">{err}</div>
						: null
				}
				<div className="mt-4">
					<Button
						label="Connect"
						onClick={changeHost}
						disable={loading}
						type={ButtonType.submit}
					/>
				</div>
			</form>
		</div>;
	}

	return <Main
		// sessionId={"0e26bf6e-1e72-4424-8e37-b57f11a75c70"}
		sessionId={sessionId}
		resetSession={resetSession}
	/>;

}

export default App;
