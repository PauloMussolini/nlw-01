import React, {useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload} from 'react-icons/fi';

import './styles.css';

// cria interface para receber a função passada pelo create-point
// Recebe um File e retorna void
interface Props{
    onFileUploaded: (file: File) => void;
}

// Altera para tipo FC -> Function Component que aceita as propriedades acima
// Recebe as propriedades (prop)
const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('');
    
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    // Chama a função recebida em props enviando o file
    onFileUploaded(file);
    // Insere a função como dependencia para atualizar 
  }, [onFileUploaded])

  const {getRootProps, getInputProps} = useDropzone({
            onDrop,
            accept: 'image/*'
        }
    )

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

        {selectedFileUrl
            ? <img src={ selectedFileUrl } alt="File Upload" />
            :
            (
                <p>
                    <FiUpload/>
                    Imagem do Estabelecimento
                </p>
          
            )
        }
          

    </div>
  )
}
export default Dropzone;