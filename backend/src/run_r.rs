use super::*;

pub fn run_within_docker(temp_path: &std::path::PathBuf) -> Result<(), std::io::Error> {
    let mut child = std::process::Command::new("Rscript")
        .args(&[dirs::_FILENAME_SCRIPT])
        .current_dir(&temp_path)
        .spawn()?;
    let status = child.wait()?;
    if !status.success() {
        return Err(std::io::Error::new(std::io::ErrorKind::Other, "Hmm"));
    }
    Ok(())
}

pub fn run_outside_docker(temp_path: &std::path::PathBuf) -> Result<(), std::io::Error> {
    let mut child = std::process::Command::new("docker")
        .args(&[
            "run",
            "-ti",
            "--rm",
            "-v",
            format!("{}:/home/docker", temp_path.to_str().unwrap()).as_str(),
            "-w",
            "/home/docker",
            dirs::_DOCKER_IMAGE_TIDYVERSE_4_0_2,
            "Rscript",
            dirs::_FILENAME_SCRIPT,
        ])
        .spawn()?;
    let status = child.wait()?;

    if !status.success() {
        return Err(std::io::Error::new(std::io::ErrorKind::Other, "Hmm"));
    }
    Ok(())
}
