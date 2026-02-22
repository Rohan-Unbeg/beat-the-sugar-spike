import { motion } from 'framer-motion';
import { Activity, Cloud, Database } from 'lucide-react';
import { useState } from 'react';

export function DataSyncSimulator() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startSync = () => {
    setSyncing(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 10 + 5;
      setProgress(Math.min(current, 100));
      if (current >= 100) {
        clearInterval(interval);
        setSyncing(false);
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Cloud className="w-6 h-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Data Sync</h3>
        </div>
        <button
          onClick={startSync}
          disabled={syncing}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
        >
          {syncing ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Start Sync
            </>
          )}
        </button>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <motion.div
          className="bg-indigo-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="text-sm text-gray-600">
        {syncing ? (
          <p>Syncing {Math.round(progress)}% complete...</p>
        ) : (
          <p>Your data is up to date. Last sync: {new Date().toLocaleTimeString()}</p>
        )}
      </div>
    </motion.div>
  );
}