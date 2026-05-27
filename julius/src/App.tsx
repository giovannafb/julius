import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react';
function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState('');
  const [diag, setDiag] = useState('');

  const calcular = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);
    if (!pesoNum || !alturaNum || alturaNum === 0) {
      setImc('');
    } else {
      const imcNum = pesoNum / (alturaNum * alturaNum);
      setImc(imcNum.toFixed(2));
      var diagnostico;
      if(imcNum <= 18.5)
        diagnostico = "Abaixo do peso";
      else if(imcNum <= 24.9)
        diagnostico = "Peso Normal";
      else if(imcNum <= 29.9)
        diagnostico = "Sobrepeso";
      else if(imcNum <= 34.9)
        diagnostico = "Obesidade grau 1";
      else if(imcNum <= 39.9)
        diagnostico = "Obesidade grau 2";
      else
        diagnostico = "Obesidade grau 3";

      setDiag(diagnostico);
    }
    
  }; 
    return (
    <div>
      <h1>Calculadora de IMC</h1>
      <p>
        <label>
          Peso (kg): <br />
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ex: 70"
          />
        </label>
      </p><p>
        <label>
          Altura (m): <br />
          <input
            type="number"
            step="0.01"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Ex: 1,75"
          />
        </label>
      </p>
      <button onClick={calcular}>Calcular IMC</button>{imc && (
        <p>
          <h2>IMC: {imc}</h2>
          <h2>{diag}</h2>
        </p>
      )}
    </div>
  );
}

export default App; 