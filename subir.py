import os
import subprocess

def subir_a_github(commit_msg, main):
    try:
        # Comprobar si hay cambios sin confirmar
        status_output = subprocess.check_output(["git", "status", "--porcelain"])
        cambios_sin_confirmar = status_output.strip()

        if cambios_sin_confirmar:
            # Realizar un commit con cambios sin confirmar
            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", "Commit de cambios locales"])

        # Configurar información de rastreo para la rama actualÑ
        subprocess.run(["git", "branch", "--set-upstream-to=origin/"+main, main])

        # Actualizar cambios remotos antes de agregar archivos locales
        subprocess.run(["git", "pull", "--rebase"])

        # Agregar todos los archivos al área de preparación
        subprocess.run(["git", "add", "."])

        # Realizar commit con el mensaje proporcionado
        subprocess.run(["git", "commit", "-m", commit_msg])

        # Realizar pull antes de empujar para evitar conflictos
        subprocess.run(["git", "pull", "--rebase"])

        # Subir los cambios al repositorio remoto
        subprocess.run(["git", "push", "origin", main])

        print("¡Subida exitosa a GitHub!")

    except Exception as e:
        print(f"Error al subir a GitHub: {e}")

# Llamada a la función con un mensaje de commit y el nombre de la rama
subir_a_github("Añadir cambios automáticos con el script", "main")
