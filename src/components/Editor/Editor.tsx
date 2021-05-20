import React from 'react';
import styles from './Editor.module.scss';

const Editor: React.FC = () => (
  <div className={styles.Editor} data-testid="Editor">
    <div className="panel">
      <strong>Panel</strong>
    </div>
    <div className="tree">
      <strong>Tree</strong>
      <ul>
        <li>
          <ul>
            <li>Lorem.</li>
            <li>Suscipit?</li>
            <li>Libero?</li>
          </ul>
        </li>
        <li>
          <ul>
            <li>Lorem.</li>
            <li>Voluptas!</li>
            <li>Rem?</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
);

export default Editor;
