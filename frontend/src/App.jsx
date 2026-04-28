import React, { useState } from 'react';
import Tabs from './components/Tabs.jsx';
import KeywordSearchTab from './components/KeywordSearchTab.jsx';
import StoredArticlesTab from './components/StoredArticlesTab.jsx';
import ImageUploadTab from './components/ImageUploadTab.jsx';

const TABS = [
  { id: 'search', label: 'Keyword Search' },
  { id: 'stored', label: 'Stored Articles' },
  { id: 'images', label: 'Image Upload' },
];

export default function App() {
  const [active, setActive] = useState('search');
  return (
    <div className="app">
      <h1>Mini Content Tracker</h1>
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      <div className="tab-content">
        {active === 'search' && <KeywordSearchTab />}
        {active === 'stored' && <StoredArticlesTab />}
        {active === 'images' && <ImageUploadTab />}
      </div>
    </div>
  );
}
