import { Modal } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function Logout() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');

  const handleToOk = () => {
    setModalText('Estamos te rediricionando ao login');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
      nookies.destroy();
      router.push('/login');
    }, 2000);
  };

  return (
    <div>
      <Modal
        visible={visible}
        title="Deseja mesmo sair dessa linda rede social!?"
        onOk={handleToOk}
        confirmLoading={confirmLoading}
        cancelButtonProps={{ disabled: true }}
        okText="Sair"
      >
        <p>
          <img
            src="https://image.freepik.com/fotos-gratis/empresarios-apertando-as-maos-em-acordo_53876-94701.jpg"
            alt="Empresários apertando as mãos"
            width="313"
            height="208"
          />
          {modalText}{' '}
        </p>
      </Modal>
    </div>
  );
}
