import React, { useCallback, useState } from 'react'
import { auth, db } from '../firebase'
import { withRouter } from 'react-router-dom'

const Login = (props) => {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState(null)
    const [esRegistro,setEsRegistro] = useState(true)
    
    const procesarDatos = e =>{
        e.preventDefault()

        if(!email.trim()){
            setError("Debe cargar el email")
            return
        }
        if(!pass.trim()){
            setError("Debe cargar el password")
            return
        }

        if(pass.length <6){
            setError("El password debe ser de 6 caracteres o mas")
            return
        }

        setError(null)

        if(esRegistro){
            registrar()
        }else{
            login()
        }

    }

    const login = useCallback(async () => {

        try {
            const res = await auth.signInWithEmailAndPassword(email,pass)
            console.log(res.user)
            setEmail('')
            setPass('')
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            if(error.code === 'auth/user-not-found'){
                setError("Email no registrado")
            }

            if(error.code === 'auth/invalid-email'){
                setError("Email no valido")
            }

            if(error.code === 'auth/wrong-password'){
                setError("Contraseña incorrecta")
            }
        }
    }, [email, pass, props.history])

    const registrar = useCallback(async()=>{

        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            console.log(res.user)
            await db.collection('usuarios').doc(res.user.email).set({
                email:res.user.email,
                uid:res.user.uid
            })
            db.collection(res.user.uid).add({
                name:'Tarea de ejemplo',
                fecha: Date.now()
            })
            setEmail('')
            setPass('')
            setError(null)
            props.history.push('/admin')
        } catch (error) {
            if(error.code === 'auth/invalid-email'){
                setError("Email no valido")
            }

            if(error.code === 'auth/email-already-in-use'){
                setError("Email ya utilizado")
            }
        }

    },[email,pass,props.history])


  return (
    <div className="mt-5">
        <h3 className="text-center">
            {esRegistro ? "Registro de Usuarios" : "Login de Acceso"}
        </h3>
        <hr />
        <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 xl-4">
                <form onSubmit={procesarDatos}>
                    {
                        error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )
                    }
                    <input 
                        type="email" 
                        className="form-control mb-2"
                        placeholder="Ingrese un email"
                        onChange={ e => setEmail(e.target.value)} 
                        value={email}
                    />
                    <input 
                        type="password" 
                        className="form-control mb-2"
                        placeholder="Ingrese un password"
                        onChange={ e => setPass(e.target.value)}
                        value={pass} 
                    />
                    <div className="d-grid gap-2">
                        <button className='btn btn-dark btn-log' type="submit">
                            {esRegistro ? "Registrarse" : "Acceder"}
                        </button>
                        <button 
                            className='btn btn-info btn-sm'
                            onClick={()=> setEsRegistro(!esRegistro)}
                            type="button"
                        >
                            {esRegistro ? "¿Ya estas registrado?" : "¿No tienes cuenta?"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default withRouter(Login)